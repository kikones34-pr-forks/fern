/**
 * This file was auto-generated by Fern from our API Definition.
 */

package resources.file.service;

import core.BearerAuth;
import java.lang.String;
import java.security.Principal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import resources.types.exceptions.NotFoundError;
import resources.types.types.File;

@RequestMapping(
    path = "/file"
)
public interface ServiceService {
  @GetMapping(
      value = "/{filename}",
      produces = "application/json"
  )
  File getFile(@RequestHeader("Authorization") BearerAuth auth, Principal principal,
      @RequestHeader("X-File-API-Version") String xFileApiVersion,
      @PathVariable("filename") String filename) throws NotFoundError;
}