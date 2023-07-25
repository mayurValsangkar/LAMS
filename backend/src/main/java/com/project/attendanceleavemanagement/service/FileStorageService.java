package com.project.attendanceleavemanagement.service;

import com.project.attendanceleavemanagement.model.FileStorage;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileStorageService {

    FileStorage saveFile(MultipartFile file) throws IOException;

    FileStorage getFileById(Long fileId);

    List<FileStorage> getAllFiles();

    Resource getFileResource(FileStorage file) throws IOException;

    ResponseEntity<?> deleteFile(Long fileId);
}
