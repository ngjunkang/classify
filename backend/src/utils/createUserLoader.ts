import DataLoader from "dataloader";
import { User } from "../entities/User";

const createUserLoader = () =>
  new DataLoader<number, User>(async (keys) => {
    const users = await User.findByIds(keys as number[]);
    const userIdToUser: Record<number, User> = {};
    users.forEach((module) => (userIdToUser[module.id] = module));
    return keys.map((key) => userIdToUser[key]);
  });

export default createUserLoader;
