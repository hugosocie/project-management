#Projects Tracking

###One JSON to rule them all...


```
$ npm install
```

###settings.json

Project with "abbr : master" list all other projects

```
"projects" : [
    {
        "name"  : "Example",
        "slug"  : "example",
        "abbr"  : "EX",
        "count" : 42,
        "color" : "#db5840",
        "pass"  : [
            {
                "id" : "abc",
                "passwd" : "123"
            },
            {
                "id" : "ABC",
                "passwd" : "123"
            }
        ]
    }
]
```

###data.json

```
"calendar" : {

    "2016" : {
        "1" : {
            "1" : false, // Day off => Holidays !
                         // Day 2, 3, 4 => Day waiting for some work
            "5" : "EX", // Day worked for "EX"
            "6" : "-EX", // Day reserved for "EX"
            "7" : {
                "am" : "-EX", // Morning reserved for "EX"
                "pm" : "EX2" // Afternoon worked for "EX2"
            },
            8" : { // AM not specified => AM waiting for some work
                "pm" : false // Afternoon off
            }
        },
        "2" : {}
    } 

}
```