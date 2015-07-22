#!/bin/bash

VERSION='0.1.0'

echo '/**
 * api.ai.js - Javascript SDK for api.ai
 * version '$VERSION'
 */' > target/header.js

echo 'js concat ...'

cat \
src/resampler.js \
src/recorderWorker.js \
src/recorder.js \
src/processors.js \
src/vad.js \
src/tts.js \
src/api.ai.js \
> target/api.ai.js

cat target/header.js target/api.ai.js > target/api.ai-v$VERSION.js

echo 'js concat done'

echo 'js compressing ...'

java -jar resources/compiler.jar --js \
src/resampler.js \
src/recorderWorker.js \
src/recorder.js \
src/processors.js \
src/vad.js \
src/tts.js \
src/api.ai.js \
--js_output_file target/api.ai.min.js

cat target/header.js target/api.ai.min.js > target/api.ai-v$VERSION.min.js

echo 'js compressing done'

rm target/header.js