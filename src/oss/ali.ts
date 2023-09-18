import { getViteBase } from "@/util";

export default function () {
    const fn = async () => {
        console.log("tt");
    };
    return getViteBase(fn);
}
