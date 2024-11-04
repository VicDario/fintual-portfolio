export interface IMapper<Tin, Tout> {
    map(model: Tin): Tout;
}
