from django.db import models

# Create your models here.
class Search(models.Model):
    url_id = models.UUIDField()
    date_created = models.DateTimeField(auto_now_add=True)
    addresses = models.JSONField()
    time_remaining = models.TimeField()
    

    def __str__(self):
        return str(self.url_id)