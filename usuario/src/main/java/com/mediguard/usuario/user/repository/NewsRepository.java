package com.mediguard.usuario.user.repository;

import com.mediguard.usuario.user.entity.NewsEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends JpaRepository<NewsEntity, Long> {

    List<NewsEntity> findByActiveTrueOrderByPublishedDateDesc();
}
