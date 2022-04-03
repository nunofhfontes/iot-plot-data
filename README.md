# iot-plot-data
Gets random data from a socket and presents it in a line chart

Considerations:
-> This project was done in a hurry, so code organization could be better. Socket logic should be extracted
from the useEffect hook; This sepparatrion would allow better testing
-> No tests were done
-> To simplify the data storage, useState hook was used, but redux could also be an alternative if heavy data usage is
required. Redux Toolkit Query was also a good alternative to fetch and cache data from the server/socket