import app from './server';
import {PORT} from './config'

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
