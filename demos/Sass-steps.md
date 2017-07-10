# Sass

## Add Sass Variables

```scss
$size: 300px;
$neg_half_size: -($size/2);
```

## Add **block** class

```scss
.esri-magnifier {

}
```

## Add **element** classes

```scss
  &__view {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
  }

  &__handle {
    box-sizing: border-box;
    display: block;
    position: absolute;
    border: 2px solid #fff;
    width: $size;
    height: $size;
    margin: $neg_half_size 0 0 $neg_half_size;
    border-radius: 50%;
    box-shadow: #000 0px 0px 8px 4px;
    cursor: move;
  }
```

## Add `hidden` **modifier** class to `&__view` selector

```scss
&--hidden {
  display: none;
}
```

## Complete SASS should be:

```scss
$size: 300px;
$neg_half_size: -($size/2);

.esri-magnifier {

  &__view {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;

    &--hidden {
      display: none;
    }
  }

  &__handle {
    box-sizing: border-box;
    display: block;
    position: absolute;
    border: 2px solid #fff;
    width: $size;
    height: $size;
    margin: $neg_half_size 0 0 $neg_half_size;
    border-radius: 50%;
    box-shadow: #000 0px 0px 8px 4px;
    cursor: move;
  }

}
```

## Compile Sass

```
grunt sass
```
