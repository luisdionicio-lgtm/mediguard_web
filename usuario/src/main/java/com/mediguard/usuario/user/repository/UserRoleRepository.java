package com.mediguard.usuario.user.repository;

import com.mediguard.usuario.user.entity.UserRoleEntity;
import com.mediguard.usuario.user.entity.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRoleEntity, UserRoleId> {
}
