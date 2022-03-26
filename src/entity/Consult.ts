import {Entity,Column, PrimaryGeneratedColumn} from 'typeorm'

/**
 * Entidad correspondiente a una consulta.
 */
@Entity()
export class Consult {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    date: Date;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @Column()
    city: string;
}


