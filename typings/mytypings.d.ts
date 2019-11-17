interface Memory {
    logging: any;
}
interface RoomMemory {
    sources: any;
    minerals: any;
    construction: string;
}

interface CreepMemory {
    containerNearControllerID: string;
    energySource: string;
    hauling: boolean;
    role: string;
    state: number;
}
