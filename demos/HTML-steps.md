# Magnifier Widget: HTML Steps

1. Add a stylesheet for our custom magnifier

```
<link rel="stylesheet" href="app/Magnifier/css/Magnifier.css">
```

2. Setup Dojo Config for custom package.

```
<script>
  var href = location.href;
  var demoLocation = href.slice(0, href.lastIndexOf("/"));
  var dojoConfig = {
    async: true,
    packages: [{
      name: "demo",
      location: demoLocation + "/app"
    }]
  };
</script>
```

3. Require our magnifier widget we will create soon and a layer it will use

```
"demo/Magnifier",
"esri/layers/TileLayer",
```

4. Add layer to magnify with widget

```
var layer = new TileLayer({
  url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
});
```

5. Initialize Magnifier

```
var magnifier = new Magnifier({
  view: view,
  layer: layer
});
```

6. Add initialized Magnifier to the view UI using manual positioning

```
view.ui.add(magnifier, "manual");
```