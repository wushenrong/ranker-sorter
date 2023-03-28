# Ranker Sorter

Yet another ranker for characters, then sort them based on Elo.

## Usage

There is an instance of the ranker at `[Insert Url]`. You will also need a json
file with this data structure:

```json
{
  "name": "Name of list",
  "players": [
    "character 1",
    "character 2",
    "character 3",
    "character n/etc"
  ]
}
```

### Offline

For an offline usage, install Python and [pdm][1]. Clone the repository and
change into the directory. Then run `pdm sync` to install dependcies. Run
`pdm run ranker_sorter.py`.

[1]: https://pdm.fming.dev/latest/