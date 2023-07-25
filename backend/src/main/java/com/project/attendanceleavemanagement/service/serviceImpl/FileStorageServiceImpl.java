package com.project.attendanceleavemanagement.service.serviceImpl;

import com.project.attendanceleavemanagement.model.FileStorage;
import com.project.attendanceleavemanagement.repository.FileStorageRepository;
import com.project.attendanceleavemanagement.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Autowired
    private FileStorageRepository fileStorageRepository;

    public FileStorage saveFile(MultipartFile file) throws IOException {
        FileStorage fileStorage = new FileStorage();
        fileStorage.setFileName(file.getOriginalFilename());
        fileStorage.setContentType(file.getContentType());
        fileStorage.setFileData(file.getBytes());
        return fileStorageRepository.save(fileStorage);
    }

    public FileStorage getFileById(Long fileId) {
        return fileStorageRepository.findById(fileId).orElse(null);
    }

    public List<FileStorage> getAllFiles() {
        return fileStorageRepository.findAll();
    }

    public Resource getFileResource(FileStorage file) {
        ByteArrayResource resource = new ByteArrayResource(file.getFileData());
        return resource;
    }

    @Override
    public ResponseEntity<?> deleteFile(Long fileId) {
        Optional<FileStorage> fileOptional = fileStorageRepository.findById(fileId);
        if (fileOptional.isPresent()) {
            FileStorage file = fileOptional.get();

            fileStorageRepository.delete(file); // Delete the file from the database

            return ResponseEntity.ok("File deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
