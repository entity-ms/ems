<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{% block title %}My Site{% endblock %}</title>
  {% block head %}
  <link rel="stylesheet" href="main.css">
  {% endblock %}
</head>
<body>
  {% block header %}{% endblock %}
  {% block content %}{% endblock %}
  {% block footer %}{% endblock %}
</body>
</html>