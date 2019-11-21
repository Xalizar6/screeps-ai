interface Memory {
    logging: any;
}
interface RoomMemory {
    sources: any;
    minerals: any;
    construction: any;
}

interface Room {
    mineral: any;
    extractor: any;
    sources: any;
}

interface CreepMemory {
    containerNearControllerID: string;
    energySource: string;
    hauling: boolean;
    role: string;
    state: number;
}
