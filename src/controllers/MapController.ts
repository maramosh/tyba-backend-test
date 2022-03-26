import { Client, PlacesNearbyRanking, PlaceType1 } from '@googlemaps/google-maps-services-js';
import {Request, Response, NextFunction} from 'express'
import {getRepository, getConnection} from 'typeorm'
import { Consult } from '../entity/Consult';

/**
 * Esta función corresponde a la toma de decisión entre buscar por ciudad o buscar por coordenadas ya que dada
 * la implementación de la Api de google estas busquedas no pueden realizarse con los mismos métodos. 
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response 
 * @param next 
 */
export const decideSearch = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;  
  if(body.city)
  {
    getRestCity(req, res, next);
  } else {
    getRestLatLng(req, res, next);
  }
}

/**
 * Esta función corresponde a la busqueda de restaurantes dada una ciudad, lo que hace es tomar la ciudad del body
 * del request y mediante el método textSearch de la Api de google buscar los restaurantes que cumplan con dicho parámetro.
 * @param req Parametro correspondiente a la Request
 * @param res Parametro correspondiente a el Response 
 * @param next 
 */
export const getRestCity = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;
  const clientMap = new Client({});
  clientMap.textSearch(
    {
      params: {
        query: body.city,
        type: PlaceType1.restaurant,
        key: process.env.GOOGLE_MAPS_API_KEY+"",  
      }, timeout : 1000, 
    }
  ).then((r) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const newConsult = getRepository(Consult).create(
        {
            date: today.toUTCString(),
            latitude: "",
            longitude: "",
            city: body.city     
        }
    )
    getRepository(Consult).save(newConsult);
    return res.json(r.data.results);
  })
  .catch((e) => {
    console.error('Error Api Google', e);
    return next(res.sendStatus(500));
  });
}

/**
 * Esta función corresponde a la busqueda de restaurantes dada unas coordenadas, lo que hace es tomar las coordenadas
 * (latitud y longitud) del body del request y mediante el método textSearch de la Api de google buscar los 
 * restaurantes que cumplan con dicho parámetro. A su vez, cada que se hace un request, esta función la guarda en la
 * base de datos para su posterior consulta.
 * @param req Parámetro correspondiente a la request
 * @param res Parámetro correspondiente a el response
 * @param next 
 */
export const getRestLatLng = (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const clientMap = new Client({});
    clientMap
      .placesNearby(
        {
          params: {
            location: [body.lat, body.lng],
            key: process.env.GOOGLE_MAPS_API_KEY+"",
            type: "restaurant",
            rankby: PlacesNearbyRanking.distance
          },
          timeout: 1000, // milliseconds
        }
      )
      .then((r) => {
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        const newConsult = getRepository(Consult).create(
            {
                date: today.toUTCString(),
                latitude: body.lat,
                longitude: body.lng,
                city:""
            }
        )
        getRepository(Consult).save(newConsult);
        return res.json(r.data.results);
      })
      .catch((e) => {
        console.error('Error Api Google', e);
        return next(res.sendStatus(500));
      });
  };

/**
 * Esta función corresponde a ver todas las consultas que se han hecho historicamente.
 * @param req Parámetro correspondiente a la request
 * @param res Parámetro correspondiente a el response 
 * @returns Retorna en el respond un Json que contiene todas las consultas existentes en la base de datos.
 */
export const getTransactions = async(req: Request, res: Response): Promise<Response> => {
    const transactions = await getRepository(Consult).find();
    return res.json(transactions);
}