package com.laxmannath.job_scraper_backend.services.fetcher;

import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.laxmannath.job_scraper_backend.dtos.JobDto;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class LlmExtractorFetcher implements JobFetcher {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.base-url}")
    private String baseUrl;

    @Value("${gemini.api.model}")
    private String model;



    @Override
    public boolean supports(String sourceType) {
        return "llm_extract".equals(sourceType);
    }

    @Override
    public List<JobDto> fetchJobs(String url, String companyName) throws Exception {
        String pageText = fetchPageText(url);
        String rawJson = callGemini(pageText);
        return parseJobsJson(rawJson, companyName, url);
    }

    private String fetchPageText(String url) throws Exception {
        Document doc = Jsoup.connect(url).userAgent("Mozilla/5.0").timeout(15000).get();
        return doc.body().text();
    }

    private String callGemini(String pageText) {
        String prompt = """
                Extract all job postings from this careers page text.
                Return ONLY a JSON array, no markdown fences, no extra text.
                Format: [{"title": "...", "location": "...", "type": "...", "description": "..."}]
                If no jobs found, return [].

                PAGE TEXT:
                %s
                """.formatted(pageText);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );

        JsonNode response = webClient.post()
                .uri(baseUrl + "/v1beta/models/" + model + ":generateContent?key=" + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .retryWhen(reactor.util.retry.Retry.backoff(3, java.time.Duration.ofSeconds(2))
                        .filter(throwable -> throwable instanceof WebClientResponseException.ServiceUnavailable))
                .block();

        return response.get("candidates").get(0).get("content").get("parts").get(0).get("text").asText();
    }

    private List<JobDto> parseJobsJson(String jsonText, String companyName, String sourceUrl) {
        List<JobDto> jobs = new ArrayList<>();
        try {
            jsonText = jsonText.replaceAll("```json|```", "").trim();
            JsonNode array = objectMapper.readTree(jsonText);
            for (JsonNode node : array) {
                String title = node.path("title").asText(null);
                if (title == null || title.isBlank()) continue;
                jobs.add(new JobDto(title, companyName,
                        node.path("location").asText(null), sourceUrl,
                        node.path("description").asText(null), null, "llm_extract"));
            }
        } catch (Exception e) {
            System.err.println("Failed to parse LLM output: " + e.getMessage());
        }
        return jobs;
    }
}
