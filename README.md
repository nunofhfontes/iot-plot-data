# iot-plot-data
Gets random data from a socket and presents it in a line chart

Considerations:
-> This project was done in a hurry, so code organization could be better. Socket logic should be extracted
from the useEffect hook; This sepparatrion would allow better testing
-> No tests were done
-> To simplify the data storage, useState hook was used, but redux could also be an alternative if heavy data usage is
required. Redux Toolkit Query was also a good alternative to fetch and cache data from the server/socket
-> socket server code was also include, to run it:
    . go to (...)/iot-plot-data/server and run the command 'node socket_js.js'. A socket will be listenning on ws://localhost:8999
-> to run the client, go to (...)/iot-plot-data/client and run the command 'npm run start', client will be running on the port 3000