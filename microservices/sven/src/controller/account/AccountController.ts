import { User } from "@discorde/datamodel";
import { getRepository } from "typeorm";

export class AccountController {
  private userRepository = getRepository(User);
}