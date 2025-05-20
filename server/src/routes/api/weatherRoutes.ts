import { Router, type Request, type Response } from 'express';
const router = Router();

// import HistoryService from '../../service/historyService.js';
import { historyService } from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';
import WeatherService from '../../service/weatherService.js';

const weatherService = new WeatherService();

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const { city } = req.body;
  const weather = weatherService;
  weather
    .getWeatherForCity(city)
    .then((data) => {
  // TODO: save city to search history
      const history = historyService;
      return history.addState(city).then(() => {
        res.json(data);
  });
})
.catch((err) => {
  res.status(500).json({ error: err.message });
});
});

// TODO: GET search history
router.get('/history', async (_req: Request, _res: Response) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, _res: Response) => {});

export default router;
