FROM node:18
COPY . .

# set up NextJS dependencies
RUN npm install
# build app
RUN npm run build
# start app
CMD npm run start