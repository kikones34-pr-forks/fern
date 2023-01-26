# This file was auto-generated by Fern from our API Definition.

from __future__ import annotations

import datetime as dt
import typing

import pydantic
import typing_extensions

from .test_case_id import TestCaseId


class TestCaseMetadata(pydantic.BaseModel):
    id: TestCaseId
    name: str
    hidden: bool

    class Partial(typing_extensions.TypedDict):
        id: typing_extensions.NotRequired[TestCaseId]
        name: typing_extensions.NotRequired[str]
        hidden: typing_extensions.NotRequired[bool]

    class Validators:
        """
        Use this class to add validators to the Pydantic model.

            @TestCaseMetadata.Validators.root()
            def validate(values: TestCaseMetadata.Partial) -> TestCaseMetadata.Partial:
                ...

            @TestCaseMetadata.Validators.field("id")
            def validate_id(id: TestCaseId, values: TestCaseMetadata.Partial) -> TestCaseId:
                ...

            @TestCaseMetadata.Validators.field("name")
            def validate_name(name: str, values: TestCaseMetadata.Partial) -> str:
                ...

            @TestCaseMetadata.Validators.field("hidden")
            def validate_hidden(hidden: bool, values: TestCaseMetadata.Partial) -> bool:
                ...
        """

        _pre_validators: typing.ClassVar[typing.List[TestCaseMetadata.Validators._PreRootValidator]] = []
        _post_validators: typing.ClassVar[typing.List[TestCaseMetadata.Validators._RootValidator]] = []
        _id_pre_validators: typing.ClassVar[typing.List[TestCaseMetadata.Validators.PreIdValidator]] = []
        _id_post_validators: typing.ClassVar[typing.List[TestCaseMetadata.Validators.IdValidator]] = []
        _name_pre_validators: typing.ClassVar[typing.List[TestCaseMetadata.Validators.PreNameValidator]] = []
        _name_post_validators: typing.ClassVar[typing.List[TestCaseMetadata.Validators.NameValidator]] = []
        _hidden_pre_validators: typing.ClassVar[typing.List[TestCaseMetadata.Validators.PreHiddenValidator]] = []
        _hidden_post_validators: typing.ClassVar[typing.List[TestCaseMetadata.Validators.HiddenValidator]] = []

        @typing.overload
        @classmethod
        def root(
            cls, *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[[TestCaseMetadata.Validators._RootValidator], TestCaseMetadata.Validators._RootValidator]:
            ...

        @typing.overload
        @classmethod
        def root(
            cls, *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [TestCaseMetadata.Validators._PreRootValidator], TestCaseMetadata.Validators._PreRootValidator
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
            cls, field_name: typing_extensions.Literal["id"], *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[[TestCaseMetadata.Validators.PreIdValidator], TestCaseMetadata.Validators.PreIdValidator]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["id"], *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[[TestCaseMetadata.Validators.IdValidator], TestCaseMetadata.Validators.IdValidator]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["name"], *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [TestCaseMetadata.Validators.PreNameValidator], TestCaseMetadata.Validators.PreNameValidator
        ]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["name"], *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[[TestCaseMetadata.Validators.NameValidator], TestCaseMetadata.Validators.NameValidator]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["hidden"], *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[
            [TestCaseMetadata.Validators.PreHiddenValidator], TestCaseMetadata.Validators.PreHiddenValidator
        ]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["hidden"], *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[
            [TestCaseMetadata.Validators.HiddenValidator], TestCaseMetadata.Validators.HiddenValidator
        ]:
            ...

        @classmethod
        def field(cls, field_name: str, *, pre: bool = False) -> typing.Any:
            def decorator(validator: typing.Any) -> typing.Any:
                if field_name == "id":
                    if pre:
                        cls._id_pre_validators.append(validator)
                    else:
                        cls._id_post_validators.append(validator)
                if field_name == "name":
                    if pre:
                        cls._name_pre_validators.append(validator)
                    else:
                        cls._name_post_validators.append(validator)
                if field_name == "hidden":
                    if pre:
                        cls._hidden_pre_validators.append(validator)
                    else:
                        cls._hidden_post_validators.append(validator)
                return validator

            return decorator

        class PreIdValidator(typing_extensions.Protocol):
            def __call__(self, __v: typing.Any, __values: TestCaseMetadata.Partial) -> typing.Any:
                ...

        class IdValidator(typing_extensions.Protocol):
            def __call__(self, __v: TestCaseId, __values: TestCaseMetadata.Partial) -> TestCaseId:
                ...

        class PreNameValidator(typing_extensions.Protocol):
            def __call__(self, __v: typing.Any, __values: TestCaseMetadata.Partial) -> typing.Any:
                ...

        class NameValidator(typing_extensions.Protocol):
            def __call__(self, __v: str, __values: TestCaseMetadata.Partial) -> str:
                ...

        class PreHiddenValidator(typing_extensions.Protocol):
            def __call__(self, __v: typing.Any, __values: TestCaseMetadata.Partial) -> typing.Any:
                ...

        class HiddenValidator(typing_extensions.Protocol):
            def __call__(self, __v: bool, __values: TestCaseMetadata.Partial) -> bool:
                ...

        class _PreRootValidator(typing_extensions.Protocol):
            def __call__(self, __values: typing.Any) -> typing.Any:
                ...

        class _RootValidator(typing_extensions.Protocol):
            def __call__(self, __values: TestCaseMetadata.Partial) -> TestCaseMetadata.Partial:
                ...

    @pydantic.root_validator(pre=True)
    def _pre_validate(cls, values: TestCaseMetadata.Partial) -> TestCaseMetadata.Partial:
        for validator in TestCaseMetadata.Validators._pre_validators:
            values = validator(values)
        return values

    @pydantic.root_validator(pre=False)
    def _post_validate(cls, values: TestCaseMetadata.Partial) -> TestCaseMetadata.Partial:
        for validator in TestCaseMetadata.Validators._post_validators:
            values = validator(values)
        return values

    @pydantic.validator("id", pre=True)
    def _pre_validate_id(cls, v: TestCaseId, values: TestCaseMetadata.Partial) -> TestCaseId:
        for validator in TestCaseMetadata.Validators._id_pre_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("id", pre=False)
    def _post_validate_id(cls, v: TestCaseId, values: TestCaseMetadata.Partial) -> TestCaseId:
        for validator in TestCaseMetadata.Validators._id_post_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("name", pre=True)
    def _pre_validate_name(cls, v: str, values: TestCaseMetadata.Partial) -> str:
        for validator in TestCaseMetadata.Validators._name_pre_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("name", pre=False)
    def _post_validate_name(cls, v: str, values: TestCaseMetadata.Partial) -> str:
        for validator in TestCaseMetadata.Validators._name_post_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("hidden", pre=True)
    def _pre_validate_hidden(cls, v: bool, values: TestCaseMetadata.Partial) -> bool:
        for validator in TestCaseMetadata.Validators._hidden_pre_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("hidden", pre=False)
    def _post_validate_hidden(cls, v: bool, values: TestCaseMetadata.Partial) -> bool:
        for validator in TestCaseMetadata.Validators._hidden_post_validators:
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
        json_encoders = {dt.datetime: lambda v: v.isoformat()}
