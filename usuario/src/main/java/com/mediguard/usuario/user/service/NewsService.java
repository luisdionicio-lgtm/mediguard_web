package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.NewsResponse;
import com.mediguard.usuario.user.entity.NewsEntity;
import com.mediguard.usuario.user.repository.NewsRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class NewsService {

    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    public List<NewsResponse> getNews() {
        return newsRepository.findByActiveTrueOrderByPublishedDateDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private NewsResponse toResponse(NewsEntity news) {
        return new NewsResponse(
                news.getId(),
                news.getTitle(),
                news.getSummary(),
                news.getContent(),
                news.getPublishedDate()
        );
    }
}
