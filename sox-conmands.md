# SoX commands 

## This are commands in terminal run

 - Command to view audio file information

```shell
    sox --i \ 
        "audio/songs/conversation.mp3"
```

- Command fix sample rate

```shell
    sox \
        -v 0.99 \
        -t mp3 \
        "audio/fx/Applause Sound Effect HD No Copyright (128 kbps).mp3" \
        -r 48000 \
        -t mp3 \
        "nome-do-arquivo-modificado.mp3"
 ```

 - Command to view file bit rate

 ```shell
    sox --i \ 
        -B \
        "audio/songs/conversation.mp3"
 ```

 - Merge audios

 ```shell
    sox \
        -t mp3 \
        -v 0.99 \
        -m "audio/songs/conversation.mp3" \
        -t mp3 \
        -v 0.99 \
        "audio/fx/Fart - Gaming Sound Effect (HD) (128 kbps).mp3" \
        -t mp3 \
        "nome-do-arquivo-modificado.mp3"
 ```
 
 [Complete SoX documentation you can see here](http://sox.sourceforge.net/sox.html)