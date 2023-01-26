# This file was auto-generated by Fern from our API Definition.

from __future__ import annotations

import datetime as dt
import typing

import pydantic
import typing_extensions

from ...commons.types.problem_id import ProblemId
from .submission_id import SubmissionId


class CustomTestCasesUnsupported(pydantic.BaseModel):
    problem_id: ProblemId = pydantic.Field(alias="problemId")
    submission_id: SubmissionId = pydantic.Field(alias="submissionId")

    class Partial(typing_extensions.TypedDict):
        problem_id: typing_extensions.NotRequired[ProblemId]
        submission_id: typing_extensions.NotRequired[SubmissionId]

    class Validators:
        """
        Use this class to add validators to the Pydantic model.

            @CustomTestCasesUnsupported.Validators.root()
            def validate(values: CustomTestCasesUnsupported.Partial) -> CustomTestCasesUnsupported.Partial:
                ...

            @CustomTestCasesUnsupported.Validators.field("problem_id")
            def validate_problem_id(problem_id: ProblemId, values: CustomTestCasesUnsupported.Partial) -> ProblemId:
                ...

            @CustomTestCasesUnsupported.Validators.field("submission_id")
            def validate_submission_id(submission_id: SubmissionId, values: CustomTestCasesUnsupported.Partial) -> SubmissionId:
                ...
        """

        _pre_validators: typing.ClassVar[typing.List[CustomTestCasesUnsupported.Validators._PreRootValidator]] = []
        _post_validators: typing.ClassVar[typing.List[CustomTestCasesUnsupported.Validators._RootValidator]] = []
        _problem_id_pre_validators: typing.ClassVar[
            typing.List[CustomTestCasesUnsupported.Validators.PreProblemIdValidator]
        ] = []
        _problem_id_post_validators: typing.ClassVar[
            typing.List[CustomTestCasesUnsupported.Validators.ProblemIdValidator]
        ] = []
        _submission_id_pre_validators: typing.ClassVar[
            typing.List[CustomTestCasesUnsupported.Validators.PreSubmissionIdValidator]
        ] = []
        _submission_id_post_validators: typing.ClassVar[
            typing.List[CustomTestCasesUnsupported.Validators.SubmissionIdValidator]
        ] = []

        @typing.overload
        @classmethod
        def root(
            cls, *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[
            [CustomTestCasesUnsupported.Validators._RootValidator], CustomTestCasesUnsupported.Validators._RootValidator
        ]:
            ...

        @typing.overload
        @classmethod
        def root(
            cls, *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [CustomTestCasesUnsupported.Validators._PreRootValidator],
            CustomTestCasesUnsupported.Validators._PreRootValidator,
        ]:
            ...

        @classmethod
        def root(cls, *, pre: bool = False) -> typing.Any:
            def decorator(validator: typing.Any) -> typing.Any:
                if pre:
                    cls._pre_validators.append(validator)
                else:
                    cls._post_validators.append(validator)
                return validator

            return decorator

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["problem_id"], *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [CustomTestCasesUnsupported.Validators.PreProblemIdValidator],
            CustomTestCasesUnsupported.Validators.PreProblemIdValidator,
        ]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["problem_id"], *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[
            [CustomTestCasesUnsupported.Validators.ProblemIdValidator],
            CustomTestCasesUnsupported.Validators.ProblemIdValidator,
        ]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["submission_id"], *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [CustomTestCasesUnsupported.Validators.PreSubmissionIdValidator],
            CustomTestCasesUnsupported.Validators.PreSubmissionIdValidator,
        ]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls,
            field_name: typing_extensions.Literal["submission_id"],
            *,
            pre: typing_extensions.Literal[False] = False,
        ) -> typing.Callable[
            [CustomTestCasesUnsupported.Validators.SubmissionIdValidator],
            CustomTestCasesUnsupported.Validators.SubmissionIdValidator,
        ]:
            ...

        @classmethod
        def field(cls, field_name: str, *, pre: bool = False) -> typing.Any:
            def decorator(validator: typing.Any) -> typing.Any:
                if field_name == "problem_id":
                    if pre:
                        cls._problem_id_pre_validators.append(validator)
                    else:
                        cls._problem_id_post_validators.append(validator)
                if field_name == "submission_id":
                    if pre:
                        cls._submission_id_pre_validators.append(validator)
                    else:
                        cls._submission_id_post_validators.append(validator)
                return validator

            return decorator

        class PreProblemIdValidator(typing_extensions.Protocol):
            def __call__(self, __v: typing.Any, __values: CustomTestCasesUnsupported.Partial) -> typing.Any:
                ...

        class ProblemIdValidator(typing_extensions.Protocol):
            def __call__(self, __v: ProblemId, __values: CustomTestCasesUnsupported.Partial) -> ProblemId:
                ...

        class PreSubmissionIdValidator(typing_extensions.Protocol):
            def __call__(self, __v: typing.Any, __values: CustomTestCasesUnsupported.Partial) -> typing.Any:
                ...

        class SubmissionIdValidator(typing_extensions.Protocol):
            def __call__(self, __v: SubmissionId, __values: CustomTestCasesUnsupported.Partial) -> SubmissionId:
                ...

        class _PreRootValidator(typing_extensions.Protocol):
            def __call__(self, __values: typing.Any) -> typing.Any:
                ...

        class _RootValidator(typing_extensions.Protocol):
            def __call__(self, __values: CustomTestCasesUnsupported.Partial) -> CustomTestCasesUnsupported.Partial:
                ...

    @pydantic.root_validator(pre=True)
    def _pre_validate(cls, values: CustomTestCasesUnsupported.Partial) -> CustomTestCasesUnsupported.Partial:
        for validator in CustomTestCasesUnsupported.Validators._pre_validators:
            values = validator(values)
        return values

    @pydantic.root_validator(pre=False)
    def _post_validate(cls, values: CustomTestCasesUnsupported.Partial) -> CustomTestCasesUnsupported.Partial:
        for validator in CustomTestCasesUnsupported.Validators._post_validators:
            values = validator(values)
        return values

    @pydantic.validator("problem_id", pre=True)
    def _pre_validate_problem_id(cls, v: ProblemId, values: CustomTestCasesUnsupported.Partial) -> ProblemId:
        for validator in CustomTestCasesUnsupported.Validators._problem_id_pre_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("problem_id", pre=False)
    def _post_validate_problem_id(cls, v: ProblemId, values: CustomTestCasesUnsupported.Partial) -> ProblemId:
        for validator in CustomTestCasesUnsupported.Validators._problem_id_post_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("submission_id", pre=True)
    def _pre_validate_submission_id(cls, v: SubmissionId, values: CustomTestCasesUnsupported.Partial) -> SubmissionId:
        for validator in CustomTestCasesUnsupported.Validators._submission_id_pre_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("submission_id", pre=False)
    def _post_validate_submission_id(cls, v: SubmissionId, values: CustomTestCasesUnsupported.Partial) -> SubmissionId:
        for validator in CustomTestCasesUnsupported.Validators._submission_id_post_validators:
            v = validator(v, values)
        return v

    def json(self, **kwargs: typing.Any) -> str:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().json(**kwargs_with_defaults)

    def dict(self, **kwargs: typing.Any) -> typing.Dict[str, typing.Any]:
        kwargs_with_defaults: typing.Any = {"by_alias": True, "exclude_unset": True, **kwargs}
        return super().dict(**kwargs_with_defaults)

    class Config:
        frozen = True
        allow_population_by_field_name = True
        extra = pydantic.Extra.forbid
        json_encoders = {dt.datetime: lambda v: v.isoformat()}
