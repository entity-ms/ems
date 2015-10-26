{% extends 'layout.swig' %}

{% block title %}{{ component.name }}: API{% endblock %}

{% block head %}
  {% parent %}
  <link rel="stylesheet" href="custom.css">
{% endblock %}

{% block content %}
<table>
  <thead>
    <th>Method</th>
    <th>Name</th>
    <th>Path</th>
  </thead>
  <tbody>
    {% for route in routes %}
    <tr>
      <td>{{ route.method }}</td>
      <td>{{ route.name }}</td>
      <td>{{ route.path }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
{% endblock %}