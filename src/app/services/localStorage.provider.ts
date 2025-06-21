import { MyLocalStorage } from "./localStorage.service";

const ServiceFactory = () => new MyLocalStorage();

export const MyLocalStorageProvider = {
    provide: MyLocalStorage,
    useFactory: () => ServiceFactory(),
}
