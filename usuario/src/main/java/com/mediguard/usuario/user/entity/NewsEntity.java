package com.mediguard.usuario.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "content_news")
public class NewsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String summary;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @Column(length = 100)
    private String image;

    @Column(name = "published_date", nullable = false)
    private OffsetDateTime publishedDate;

    @Column(name = "is_active", nullable = false)
    private Boolean active;

    protected NewsEntity() {
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getSummary() {
        return summary;
    }

    public String getContent() {
        return content;
    }

    public String getImage() {
        return image;
    }

    public OffsetDateTime getPublishedDate() {
        return publishedDate;
    }

    public Boolean getActive() {
        return active;
    }
}
