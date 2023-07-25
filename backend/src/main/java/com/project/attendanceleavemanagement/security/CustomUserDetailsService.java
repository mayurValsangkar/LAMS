package com.project.attendanceleavemanagement.security;

import com.project.attendanceleavemanagement.exception.ResourceNotFoundException;
import com.project.attendanceleavemanagement.model.User;
import com.project.attendanceleavemanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

//CustomUserDetailsService  represents a custom implementation of the Spring Security UserDetailsService interface.
//The UserDetailsService interface is used to retrieve user-specific data for authentication and authorization purposes.

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String usernameOrEmail)
            throws UsernameNotFoundException {

        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found with username or email : " + usernameOrEmail)
                );


        String roleName = user.getRole().name();
        List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList(roleName);


        return UserPrincipal.create(user);
    }

    // This annotation is used to define the scope of a database transaction.
    // It ensures that the method executes within a transaction, and if an exception occurs,
    // the transaction is rolled back, undoing any changes made to the database during the transaction.
    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User", "id", id)
        );

        return UserPrincipal.create(user);
    }
}
