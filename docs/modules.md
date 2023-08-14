[readmeq](README.md) / Exports

# readmeq

## Table of contents

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

index.ts:26

___

### FilePath

Ƭ **FilePath**: `string`

filePath data type (string)

#### Defined in

index.ts:117

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

index.ts:72

___

### Result

Ƭ **Result**<`T`\>: { `status`: ``"ok"`` ; `value`: `T`  } \| { `error`: `Error` ; `status`: ``"error"``  }

Result to return

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | value type of `status: 'ok'` |

#### Defined in

index.ts:123

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

index.ts:215

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

index.ts:145

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

index.ts:350

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

index.ts:265
