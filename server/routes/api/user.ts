import { Request, Response, Router } from 'express';
import whichPolygon from 'which-polygon';
const geojson = require('../../../server/geo.json');
import axios from 'axios';
import { geoLocation_URL, geoLocation_APIKEY } from '../../config';

const query = whichPolygon(geojson);
const router = Router();

const getOutletName = (lat, long) => {
    const result = query([lat, long]);
    return result ? result.name : 'Not Found';
}

router.get('/location', (req: Request, res: Response) => {
    try {   

        if(req.query && !Object.keys(req.query).length) {
            return res.status(400).json({
                errorMessage: 'Please provide location'
            });
        }

        if((!req.query.lat && req.query.long) || (req.query.lat && !req.query.long)) {
            return res.status(400).json({
                errorMessage: 'Please provide both latitude and longitude'
            });
        }

        const location = getOutletName(req.query.lat, req.query.long);
        const statusCode = location === 'Not Found' ? 404 : 200;

        return res.status(statusCode).json({
            location: location
        }).end();
    } catch (err) {
        return res.status(500).json({
            errorMessage: err.message,
        });
    }
});

router.get('/address', async (req, res) => {
    try {   

        if(req.query && !Object.keys(req.query).length) {
            return res.status(400).json({
                errorMessage: 'Please provide required parameters.'
            });
        }

        if(!req.query.address.length) {
            return res.status(400).json({
                errorMessage: 'Please provide address.'
            });
        }

        const url = geoLocation_URL + req.query.address + '+CA&key=' + geoLocation_APIKEY;
        const geoLocation = await axios.get(url).catch(() => {
            return res.status(500).json({
                errorMessage: 'Please try again.'
            });
          }) 
    
        if(!geoLocation) {
            return res.status(500).json({
                errorMessage: 'NOT fOUND'
            });
        }

        const location = getOutletName(geoLocation.data.results.geometry.location.lat, 
            geoLocation.data.results.geometry.location.long);

        const statusCode = location === 'Not Found' ? 404 : 200;

        return res.status(statusCode).json({
            location: location
        }).end();

    } catch (err) {
        return res.status(500).json({
            errorMessage: err.message,
        });
    }
});
export default router;