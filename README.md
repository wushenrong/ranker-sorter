# Ranker Sorter

Yet another ranker for characters, then sort them based on Elo.

## Usage

There is an instance of the ranker at `[Insert Url]`. You will also need a json
file with this data structure:

```json
{
    "name": "Name of list",
    "players": ["character 1", "character 2", "character 3", "character n/etc"],
    "images": [
        "Optional",
        "Must be the same length as players",
        "Must be in the same order as the players",
        "Must be an url pointing to an image"
    ]
}
```

## License

Ranker Sorter is licensed under the MIT License.
