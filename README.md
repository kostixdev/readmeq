# readmeq
> Just another one solution for modifying your `README.md` (not only) file.

Can be useful if you want to **modify some parts** of your `README.md` (not only) file on any step of `build`, `commit`, `pre-comit`, etc.


## Usage:

1. put some sections to **any place** of your `README.md` file like this:
```md
<!--READMEQ:someKey-->someData<!--/READMEQ:someKey-->
```
or like this:
```md
<!--READMEQ:someKey-->
any **data** _between_
and <a href="https://kostix.dev">anything</a> else
<!--/READMEQ:someKey-->
```
2. use `modifyReadmeqSingle` method like this:
```js
await modifyReadmeqSingle('someKey', 'someOtherData{MODIFIED)', { n : true });
```
3. the result in your file will be:
```md
<!--READMEQ:someKey-->
someOtherData(MODIFIED)
<!--/READMEQ:someKey-->
```



## TODO:

  - [ ] mk some docs
  - [ ] mk mass modifying
  - [ ] pre-save (to restore in some cases) target file before modifying will be good feat




---
© [kostix.dev][kostix-url]



[kostix-url]: https://kostix.dev