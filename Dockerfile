FROM dockerfile/nodejs
ADD . /app/

RUN ["cd /app", "npm install", "npm install -g mocha istanbul"]
CMD ["npm test"]