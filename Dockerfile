FROM node:7
RUN mkdir /data
WORKDIR /data
ADD package.json /data/package.json
RUN npm install
ADD . /data
ENTRYPOINT ["node", "src/proxo.js"]
