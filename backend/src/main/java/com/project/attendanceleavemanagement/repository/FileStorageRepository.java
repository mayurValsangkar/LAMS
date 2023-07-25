package com.project.attendanceleavemanagement.repository;

import com.project.attendanceleavemanagement.model.FileStorage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileStorageRepository extends JpaRepository<FileStorage, Long> {

}
