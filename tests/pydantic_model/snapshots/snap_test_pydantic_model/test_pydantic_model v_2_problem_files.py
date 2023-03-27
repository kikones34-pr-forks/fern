# This file was auto-generated by Fern from our API Definition.

from __future__ import annotations

import datetime as dt
import typing

import pydantic
import typing_extensions

from ...core.datetime_utils import serialize_datetime
from .file_info_v_2 import FileInfoV2


class Files(pydantic.BaseModel):
    files: typing.List[FileInfoV2]

    class Partial(typing_extensions.TypedDict):
        files: typing_extensions.NotRequired[typing.List[FileInfoV2]]

    class Validators:
        """
        Use this class to add validators to the Pydantic model.

            @Files.Validators.root()
            def validate(values: Files.Partial) -> Files.Partial:
                ...

            @Files.Validators.field("files")
            def validate_files(files: typing.List[FileInfoV2], values: Files.Partial) -> typing.List[FileInfoV2]:
                ...
        """

        _pre_validators: typing.ClassVar[typing.List[Files.Validators._PreRootValidator]] = []
        _post_validators: typing.ClassVar[typing.List[Files.Validators._RootValidator]] = []
        _files_pre_validators: typing.ClassVar[typing.List[Files.Validators.PreFilesValidator]] = []
        _files_post_validators: typing.ClassVar[typing.List[Files.Validators.FilesValidator]] = []

        @typing.overload
        @classmethod
        def root(
            cls, *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[[Files.Validators._RootValidator], Files.Validators._RootValidator]:
            ...

        @typing.overload
        @classmethod
        def root(
            cls, *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[[Files.Validators._PreRootValidator], Files.Validators._PreRootValidator]:
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
            cls, field_name: typing_extensions.Literal["files"], *, pre: typing_extensions.Literal[True]
        ) -> typing.Callable[[Files.Validators.PreFilesValidator], Files.Validators.PreFilesValidator]:
            ...

        @typing.overload
        @classmethod
        def field(
            cls, field_name: typing_extensions.Literal["files"], *, pre: typing_extensions.Literal[False] = False
        ) -> typing.Callable[[Files.Validators.FilesValidator], Files.Validators.FilesValidator]:
            ...

        @classmethod
        def field(cls, field_name: str, *, pre: bool = False) -> typing.Any:
            def decorator(validator: typing.Any) -> typing.Any:
                if field_name == "files":
                    if pre:
                        cls._files_pre_validators.append(validator)
                    else:
                        cls._files_post_validators.append(validator)
                return validator

            return decorator

        class PreFilesValidator(typing_extensions.Protocol):
            def __call__(self, __v: typing.Any, __values: Files.Partial) -> typing.Any:
                ...

        class FilesValidator(typing_extensions.Protocol):
            def __call__(self, __v: typing.List[FileInfoV2], __values: Files.Partial) -> typing.List[FileInfoV2]:
                ...

        class _PreRootValidator(typing_extensions.Protocol):
            def __call__(self, __values: typing.Any) -> typing.Any:
                ...

        class _RootValidator(typing_extensions.Protocol):
            def __call__(self, __values: Files.Partial) -> Files.Partial:
                ...

    @pydantic.root_validator(pre=True)
    def _pre_validate(cls, values: Files.Partial) -> Files.Partial:
        for validator in Files.Validators._pre_validators:
            values = validator(values)
        return values

    @pydantic.root_validator(pre=False)
    def _post_validate(cls, values: Files.Partial) -> Files.Partial:
        for validator in Files.Validators._post_validators:
            values = validator(values)
        return values

    @pydantic.validator("files", pre=True)
    def _pre_validate_files(cls, v: typing.List[FileInfoV2], values: Files.Partial) -> typing.List[FileInfoV2]:
        for validator in Files.Validators._files_pre_validators:
            v = validator(v, values)
        return v

    @pydantic.validator("files", pre=False)
    def _post_validate_files(cls, v: typing.List[FileInfoV2], values: Files.Partial) -> typing.List[FileInfoV2]:
        for validator in Files.Validators._files_post_validators:
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
        json_encoders = {dt.datetime: serialize_datetime}
