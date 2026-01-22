---
title: "GCDS Components"
date: 2023-10-25
draft: false
sidebar: false
---


## Intro

This should highlight all the features of the GCDS Components.

## Components

### Needs Review

If you have a block of text, and you want "mark" it for review, you can simply wrap it with a `needs-review` short-code.

It renders {{< needs-review >}}like this, so it's very obvious{{< /needs-review >}}. It will also get caught by the `content-check` pipeline, and/or the `needsreview_check.js` script.

Should be useful to prevent draft/inaccurate content from making it to your published site.

### Translation Notice

If a page hasn't yet been translated to French (assuming your default drafting/writing language is English), you can add the `translation-note` short-code to the top of the page, and it will render a notice/alert.

Like this:

{{< translation-note >}}

### General Notices

There's also a more generalized notice, called, well "notice".

You call it via the `notice` shortcode, and it requires a `title` parameter. You can also customize the type, with the `type` paramter, which accepts `info`, `success`, `warning`, or `danger`; defaults to `info`.

{{< notice title="Notice - Info" >}}
This text will be inside the notice
{{< /notice >}}

{{< notice title="Notice - Success" type="success" >}}
This text will be inside the notice
{{< /notice >}}

{{< notice title="Notice - Warning" type="warning" >}}
This text will be inside the notice
{{< /notice >}}

{{< notice title="Notice - Danger" type="danger" >}}
This text will be inside the notice
{{< /notice >}}

### Tables

Markdown naturally supports tables.

| Column 1 | Column 2 | Column 3 |
| --- | --- | --- |
| data | number | date |

As you can see, tables by default render with "auto" width, where the table takes the combined width of all the text in the columns.

There's also a class defined to make tables full width. To make that happen, add a Markdown Attribute below the table, specifying the "full-width" class: `{ .full-width }`.  
If you have the markdownlint extension installed, or are using the equivalent Github Action, you'll also want to tell it to ignore that line, by appending `<!-- markdownlint-disable-line MD056 MD055 -->` to it.

A table with that class renders as such:

| Column 1 | Column 2 | Column 3 |
| --- | --- | --- |
| data | number | date |
{ .full-width } <!-- markdownlint-disable-line MD056 MD055 -->

### Code

You can highlight code inline, by wrapping it in backticks (&#96;). When you do that, code looks like `this`.

You can also wrap multiple lines of code in "fence blocks", using three backticks on a single line.  
That looks like this:

````text {style="github-dark"}
```json
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
```
````

And will render like this:

```json
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
```
