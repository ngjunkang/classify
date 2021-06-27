import DataLoader from "dataloader";
import { Module } from "../entities/Module";

const createModuleLoader = () =>
  new DataLoader<number, Module>(async (keys) => {
    const modules = await Module.findByIds(keys as number[]);
    const moduleIdToModule: Record<number, Module> = {};
    modules.forEach((module) => (moduleIdToModule[module.id] = module));
    return keys.map((key) => moduleIdToModule[key]);
  });

export default createModuleLoader;
