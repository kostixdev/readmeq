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
await modifyReadmeqSingle('someKey', 'someOtherData(MODIFIED)', { n : true });
```
3. the result in your file will be:
```md
<!--READMEQ:someKey-->
someOtherData(MODIFIED)
<!--/READMEQ:someKey-->
```


<!--READMEQ:docsSection-->
## Functions

<dl>
<dt><a href="#modifyReadmeqSingle">modifyReadmeqSingle(key, newData, options)</a> ⇒ <code>boolean</code></dt>
<dd><p>Modify single <code>key</code> section.</p>
</dd>
<dt><a href="#backupReadmeq">backupReadmeq(filePath, options)</a> ⇒ <code>string</code></dt>
<dd><p>Backup readmeq modified file.
Use this method when its important to have <strong>previous versions</strong> of modified file. Or <strong>any other cases</strong> when its needed.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#backupOptions">backupOptions</a> : <code>Object</code></dt>
<dd><p>Backup options.</p>
</dd>
<dt><a href="#modifyOptions">modifyOptions</a> : <code>Object</code></dt>
<dd><p>Modify options.</p>
</dd>
</dl>

<a name="modifyReadmeqSingle"></a>

## modifyReadmeqSingle(key, newData, options) ⇒ <code>boolean</code>
Modify single `key` section.

**Kind**: global function  
**Returns**: <code>boolean</code> - file modified (or throw some error)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | section key |
| newData | <code>string</code> | section data |
| options | [<code>modifyOptions</code>](#modifyOptions) | additional modify options |

<a name="backupReadmeq"></a>

## backupReadmeq(filePath, options) ⇒ <code>string</code>
Backup readmeq modified file.
Use this method when its important to have **previous versions** of modified file. Or **any other cases** when its needed.

**Kind**: global function  
**Returns**: <code>string</code> - backup file path (or throw some error)  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>string</code> | path to file |
| options | [<code>backupOptions</code>](#backupOptions) | additional backup options |

<a name="backupOptions"></a>

## backupOptions : <code>Object</code>
Backup options.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| basePath | <code>string</code> | <code>&quot;&#x60;process.cwd()&#x60;&quot;</code> | projects base/root path |
| backupsPath | <code>string</code> | <code>&quot;&#x60;path.join(basePath,&#x27;.readmeqBackups&#x27;)&#x60;&quot;</code> | backups path |
| backupSufix | <code>string</code> | <code>&quot;&#x60;_backup${Date.now()}&#x60;&quot;</code> | backup file suffix (`file.ext` => `file${backupSufix}.ext`) |

<a name="modifyOptions"></a>

## modifyOptions : <code>Object</code>
Modify options.

**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| filePath | <code>string</code> | <code>&quot;./README.md&quot;</code> | path to modified file |
| sectionStart | <code>string</code> | <code>&quot;&lt;!--READMEQ:KEY_VALUE--&gt;&quot;</code> | section start pattern, where `KEY_NAME` - your section key |
| sectionEnd | <code>string</code> | <code>&quot;&lt;!--/READMEQ:KEY_VALUE--&gt;&quot;</code> | section end pattern, where `KEY_NAME` - your section key |
| n | <code>boolean</code> | <code>false</code> | insert `newData` from new line (`\n` on start/end) |
| backup | <code>boolean</code> | <code>false</code> | apply `backupReadmeq` method mefore modifying |
| backupOptions | [<code>backupOptions</code>](#backupOptions) |  | applying to `backupReadmeq` method if `backup=true` |


<!--/READMEQ:docsSection-->


## TODO:

  - [ ] mk mass modifying
  - [ ] move backup to separate module (+add restore functionality)



---
© [kostix.dev][kostix-url]



[kostix-url]: https://kostix.dev