#!/bin/bash

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

echo 'done'