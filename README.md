# Ranker Sorter

Yet another ranker for characters, then sort them based on Elo.

## Usage

There is an instance of the ranker at
<https://twopizza9621536.github.io/ranker-sorter>. You will also need a json
file with this data structure:

```jsonc
{
  "title": "Name of list",
  "players": [
    {
      "name": "character 1",
      "image": "https://example.com/charactericon.png" // url to image, optional
    },
    {
      "name": "character 2"
    },
    {
      "name": "character 3"
    },
    {
      "name": "etc",
      "image": "https://example.com/anothercharactericon.jpg" // Must use https
    }
  ]
}
```

## License

Ranker Sorter is licensed under the MIT License.
