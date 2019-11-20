interface Memory {
    logging: any;
}
interface RoomMemory {
    sources: any;
    minerals: any;
    construction: any;
}

interface CreepMemory {
    containerNearControllerID: string;
    energySource: string;
    hauling: boolean;
    role: string;
    state: number;
}
