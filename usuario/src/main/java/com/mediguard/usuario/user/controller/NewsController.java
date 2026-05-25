package com.mediguard.usuario.user.controller;

import com.mediguard.usuario.user.dto.NewsResponse;
import com.mediguard.usuario.user.service.NewsService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/news/")
    public ResponseEntity<List<NewsResponse>> getNews() {
        return ResponseEntity.ok(newsService.getNews());
    }
}
