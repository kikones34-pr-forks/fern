# This file was auto-generated by Fern from our API Definition.

from __future__ import annotations

import typing

from .test_case_hidden_grade import TestCaseHiddenGrade
from .test_case_non_hidden_grade import TestCaseNonHiddenGrade


class TestCaseGrade_Hidden(TestCaseHiddenGrade):
    type: typing.Literal["hidden"]

    class Config:
        frozen = True
        smart_union = True
        allow_population_by_field_name = True


class TestCaseGrade_NonHidden(TestCaseNonHiddenGrade):
    type: typing.Literal["nonHidden"]

    class Config:
        frozen = True
        smart_union = True
        allow_population_by_field_name = True


TestCaseGrade = typing.Union[TestCaseGrade_Hidden, TestCaseGrade_NonHidden]
