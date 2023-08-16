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

## Documantation:
Check documentation [here][docs-url]
<!--READMEQ:docsSection-->
### Type Aliases

- [BackupOptions](modules.md#backupoptions)
- [FilePath](modules.md#filepath)
- [ModifyOptions](modules.md#modifyoptions)
- [Result](modules.md#result)

### Functions

- [backupReadmeq](modules.md#backupreadmeq)
- [modifyReadmeqSingle](modules.md#modifyreadmeqsingle)
- [restoreReadmeqFromPath](modules.md#restorereadmeqfrompath)
- [restoreReadmeqLatest](modules.md#restorereadmeqlatest)

## Type Aliases

### BackupOptions

Ƭ **BackupOptions**: `Object`

Backup options.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `backupSuffix` | `string` | backup file suffix (`file.ext` => `file${backupSuffix}.ext`) **`Default`** `_backup${Date.now()}` |
| `backupSuffixMatch` | `string` | backup file suffing pattern (`RegEx`), where `([0-9]+)` - uniq time-based **integer** (**!important**) id of its backup version **`Default`** `_backup([0-9]+)` |
| `backupsPath` | `string` | projects base/root path **`Default`** `${path.join(basePath,'.readmeqBackups')}` |
| `basePath` | `string` | projects base/root path **`Default`** `${process.cwd()}` |

#### Defined in

[index.ts:17](https://github.com/kostixdev/readmeq/blob/430a28f/src/index.ts#L17)

___

### FilePath

Ƭ **FilePath**: `string`

filePath data type (string)

#### Defined in

[index.ts:96](https://github.com/kostixdev/readmeq/blob/430a28f/src/index.ts#L96)

___

### ModifyOptions

Ƭ **ModifyOptions**: `Object`

Modify options.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `backup` | `boolean` | apply `backupReadmeq` method mefore modifying **`Default`** ```ts false ``` |
| `backupOptions` | [`BackupOptions`](modules.md#backupoptions) | applying to `backupReadmeq` method if `backup=true` **`Default`** ```ts backupOptions ``` |
| `filePath` | `string` | path to modified file **`Default`** ```ts './README.md' ``` |
| `n` | `boolean` | insert `newData` from new line (`\n` on start/end) **`Default`** ```ts false ``` |
| `sectionEnd` | `string` | section end pattern, where `KEY_NAME` (**!important**) - your section key **`Default`** ```ts '<!--/READMEQ:KEY_VALUE-->' ``` |
| `sectionStart` | `string` | section start pattern, where `KEY_NAME` (**!important**) - your section key **`Default`** ```ts '<!--READMEQ:KEY_VALUE-->' ``` |

#### Defined in

[index.ts:51](https://github.com/kostixdev/readmeq/blob/430a28f/src/index.ts#L51)

___

### Result

Ƭ **Result**<`T`\>: { `status`: ``"ok"`` ; `value`: `T`  } \| { `error`: `Error` ; `status`: ``"error"``  }

Result to return

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | value type of `status: 'ok'` |

#### Defined in

[index.ts:102](https://github.com/kostixdev/readmeq/blob/430a28f/src/index.ts#L102)

## Functions

### backupReadmeq

▸ **backupReadmeq**(`filePath`, `options?`): `Promise`<[`Result`](modules.md#result)<`string`\>\>

Backup readmeq modified file.
Use this method when its important to have **previous versions** of modified file. Or **any other cases** when its needed.
Use this method **on your own risk**.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filePath` | `string` | path to file |
| `options?` | `Partial`<[`BackupOptions`](modules.md#backupoptions)\> | - |

#### Returns

`Promise`<[`Result`](modules.md#result)<`string`\>\>

backup file path (or throw some error)

**`Async`**

#### Defined in

[index.ts:194](https://github.com/kostixdev/readmeq/blob/430a28f/src/index.ts#L194)

___

### modifyReadmeqSingle

▸ **modifyReadmeqSingle**(`key`, `newData`, `options?`): `Promise`<[`Result`](modules.md#result)<`boolean`\>\>

Modify single `key` section.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | section key |
| `newData` | `string` | section data |
| `options?` | `Partial`<[`ModifyOptions`](modules.md#modifyoptions)\> | - |

#### Returns

`Promise`<[`Result`](modules.md#result)<`boolean`\>\>

file modified (or throw some error)

**`Async`**

#### Defined in

[index.ts:124](https://github.com/kostixdev/readmeq/blob/430a28f/src/index.ts#L124)

___

### restoreReadmeqFromPath

▸ **restoreReadmeqFromPath**(`filePath`, `backupFilePath`, `backupBeforeRestore?`, `options?`): `Promise`<[`Result`](modules.md#result)<`boolean`\>\>

Restore version of readmeq modified file from specific path.
Use this method **on your own risk**.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `filePath` | `string` | `undefined` | path to file |
| `backupFilePath` | `string` | `undefined` | path to its backup file |
| `backupBeforeRestore` | `boolean` | `true` | - |
| `options?` | `Partial`<[`BackupOptions`](modules.md#backupoptions)\> | `undefined` | - |

#### Returns

`Promise`<[`Result`](modules.md#result)<`boolean`\>\>

file restored (or throw some error)

**`Async`**

#### Defined in

[index.ts:329](https://github.com/kostixdev/readmeq/blob/430a28f/src/index.ts#L329)

___

### restoreReadmeqLatest

▸ **restoreReadmeqLatest**(`filePath`, `backupBeforeRestore?`, `options?`): `Promise`<[`Result`](modules.md#result)<`boolean`\>\>

Restore latest version of readmeq modified file. Based on its backup suffix.
Use this method **on your own risk**.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `filePath` | `string` | `undefined` | path to file |
| `backupBeforeRestore` | `boolean` | `true` | - |
| `options?` | `Partial`<[`BackupOptions`](modules.md#backupoptions)\> | `undefined` | - |

#### Returns

`Promise`<[`Result`](modules.md#result)<`boolean`\>\>

file restored (or throw some error)

**`Async`**

#### Defined in

[index.ts:244](https://github.com/kostixdev/readmeq/blob/430a28f/src/index.ts#L244)

<!--/READMEQ:docsSection-->


## TODO:

  - [ ] mk mass modifying
  - [ ] move backup/restore to separate module



---
© [kostix.dev][kostix-url]



[kostix-url]: https://kostix.dev

[docs-url]: docs/README.md
