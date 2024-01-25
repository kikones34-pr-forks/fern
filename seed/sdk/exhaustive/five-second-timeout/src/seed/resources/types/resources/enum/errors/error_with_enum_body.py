# This file was auto-generated by Fern from our API Definition.

from ......core.api_error import ApiError
from ..types.weather_report import WeatherReport


class ErrorWithEnumBody(ApiError):
    def __init__(self, body: WeatherReport):
        super().__init__(status_code=400, body=body)